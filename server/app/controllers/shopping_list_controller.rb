class ShoppingListController < ApplicationController
  before_action :set_item, only: %i[ show update destroy ]

  # GET /items
  def index
    @items = ShoppingList.all

    render json: @items
  end

  # GET /shoppinglist/1
  def show
    render json: @item
  end

  # POST /shoppinglist
  def create
    @item = ShoppingList.new(item_params)

    if @item.save
      render json: @item, status: :created
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /shoppinglist/1
  def update
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # DELETE /shoppinglist/1
  def destroy
    @item.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = ShoppingList.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def item_params
      params.require(:item).permit(:name, :quantity, :item_id)
    end
end
