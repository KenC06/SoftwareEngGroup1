# frozen_string_literal: true
# lib/inventory.rb
require 'json'
require 'time'

module KitchenInventory
  # Domain: Item
  class Item
    attr_reader :item_id, :name, :quantity, :stock_threshold

    def initialize(item_id:, name:, quantity:, stock_threshold:)
      @item_id = item_id.to_s
      @name = name.to_s.strip
      @quantity = Integer(quantity)
      @stock_threshold = Integer(stock_threshold)
      validate_non_negative!(@quantity, 'quantity')
      validate_non_negative!(@stock_threshold, 'stock_threshold')
    end

    def change_amount!(delta)
      delta = Integer(delta)
      @quantity = [@quantity + delta, 0].max
    end

    def set_stock_threshold!(threshold)
      threshold = Integer(threshold)
      validate_non_negative!(threshold, 'stock_threshold')
      @stock_threshold = threshold
    end

    def low_stock?
      @quantity < @stock_threshold
    end

    def to_h
      { item_id: @item_id, name: @name, quantity: @quantity, stock_threshold: @stock_threshold }
    end

    private

    def validate_non_negative!(value, field)
      raise ArgumentError, "#{field} must be >= 0" if value.negative?
    end
  end

  # Service support: Notification
  Notification = Struct.new(:type, :item_id, :name, :quantity, :threshold, :message, :created_at, keyword_init: true)

  # Service: NotificationSystem (improved R02)
  class NotificationSystem
    attr_reader :log

    def initialize(adapter: nil)
      # adapter is a callable ->(notification) { ... } for real delivery; optional for now
      @adapter = adapter
      @log = []
    end

    def notify_low_stock(item)
      n = Notification.new(
        type: 'LOW_STOCK',
        item_id: item.item_id,
        name: item.name,
        quantity: item.quantity,
        threshold: item.stock_threshold,
        message: "Low Stock: #{item.name} (qty=#{item.quantity}, thr=#{item.stock_threshold})",
        created_at: Time.now.utc.iso8601
      )
      @log << n
      @adapter&.call(n)
      n
    end

    def save_log(file_path = 'data/notifications.json')
      payload = { saved_at: Time.now.utc.iso8601, notifications: @log.map(&:to_h) }
      File.write(file_path, JSON.pretty_generate(payload))
      @log.size
    end
  end

  # Domain: Inventory (contains Items)
  class Inventory
    def initialize(items = [])
      @items_by_id = {}
      items.each { |i| add_item(i) }
    end

    def add_item(item)
      @items_by_id[item.item_id] = item
      item
    end

    def remove_item(item_id)
      @items_by_id.delete(item_id.to_s)
    end

    def get_item(item_id)
      @items_by_id[item_id.to_s]
    end

    def items
      @items_by_id.values
    end

    def change_item_amount(item_id, delta, notifier: nil)
      item = @items_by_id[item_id.to_s]
      return nil unless item

      item.change_amount!(delta)
      if item.low_stock? && notifier
        notifier.notify_low_stock(item)
      end
      item
    end

    def set_item_threshold(item_id, threshold, notifier: nil)
      item = @items_by_id[item_id.to_s]
      return nil unless item

      item.set_stock_threshold!(threshold)
      if item.low_stock? && notifier
        notifier.notify_low_stock(item)
      end
      item
    end

    # Batch scan: returns notifications for all items that are currently low
    def scan_for_low_stock(notifier:)
      results = []
      items.each do |item|
        results << notifier.notify_low_stock(item) if item.low_stock?
      end
      results
    end

    def low_stock_items
      items.select(&:low_stock?)
    end

    def save(file_path = 'data/inventory.json')
      payload = {
        saved_at: Time.now.utc.iso8601,
        items: items.map(&:to_h)
      }
      File.write(file_path, JSON.pretty_generate(payload))
      items.count
    end

    # Simple load helper for demos
    def self.load(file_path = 'data/inventory.json')
      return new unless File.exist?(file_path)

      raw = JSON.parse(File.read(file_path), symbolize_names: true)
      list = (raw[:items] || []).map do |h|
        Item.new(item_id: h[:item_id], name: h[:name], quantity: h[:quantity], stock_threshold: h[:stock_threshold])
      end
      new(list)
    end
  end

  # R04: Shopping list model (domain)
  class ShoppingList
    # line: { item_id:, name:, suggested_qty:, note: }
    attr_reader :lines

    def initialize
      @lines = []
    end

    def add_line(item_id:, name:, suggested_qty:, note: nil)
      @lines << { item_id: item_id&.to_s, name: name, suggested_qty: Integer(suggested_qty), note: note }
    end

    def to_h
      { generated_at: Time.now.utc.iso8601, lines: @lines }
    end

    def save(file_path = 'data/shopping_list.json')
      File.write(file_path, JSON.pretty_generate(to_h))
      @lines.size
    end
  end

  # R04: Shopping list service (generation + merge)
  class ShoppingListService
    # Suggest to bring stock up to threshold at minimum (or 1 if threshold is 0)
    def generate_from_inventory(inventory)
      list = ShoppingList.new
      inventory.low_stock_items.each do |item|
        needed = [item.stock_threshold - item.quantity, 1].max
        list.add_line(item_id: item.item_id, name: item.name, suggested_qty: needed, note: 'auto: low stock')
      end
      list
    end

    # Allow manual additions (for ad-hoc items)
    # extras: array of { name:, qty:, note: }
    def merge_manual(list, extras = [])
      extras.each do |e|
        list.add_line(item_id: nil, name: e[:name].to_s.strip, suggested_qty: Integer(e[:qty]), note: e[:note])
      end
      list
    end
  end
end
