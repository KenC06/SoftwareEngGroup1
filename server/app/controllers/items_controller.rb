class ItemsController < ApplicationController
  before_action :set_item, only: %i[ show update destroy ]

  # GET /items
  def index
    @items = Item.all
    render json: @items
  end

  # GET /items/1
  def show
    render json: @item
  end

  # POST /items
  def create
    @item = Item.new(item_params)

    if @item.save
      render json: @item, status: :created, location: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /items/1
  def update
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # DELETE /items/1
  def destroy
    @item.destroy!
  end

  # GET /items/barcode/:code
  def search_barcode
    render json: Item.where(barcode: params[:code])
  end

  # GET /items/notifications
  def notifications
    render json: Item.where("date() > useby_notify OR date() > useby OR low_stock_threshold >= quantity")
  end

  # GET /items/expiring_soon
  def expiring_soon
    @items = Item.expiring_soon
    render json: @items
  end

  private
    def set_item
      @item = Item.find(params[:id])
    end

    def item_params
      params.require(:item).permit(:name, :quantity, :low_stock_threshold, :barcode, :useby, :useby_notify, :expiry_date, :reminder_days_before)
    end
end