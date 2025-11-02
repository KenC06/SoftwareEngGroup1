# frozen_string_literal: true
# bin/demo.rb
# Demo CLI to exercise R02 and R04 (backend only)
require_relative '../lib/inventory'

include KitchenInventory

Dir.mkdir('data') unless Dir.exist?('data')

inv = Inventory.load # or Inventory.new
notifier = NotificationSystem.new

def prompt(label)
  print(label)
  STDIN.gets&.chomp || ''
end

def menu
  puts
  puts '1) List items'
  puts '2) Add/upsert item'
  puts '3) Change item amount'
  puts '4) Remove item'
  puts '5) Set item threshold'
  puts '6) Scan & show low-stock alerts (R02)'
  puts '7) Generate shopping list from low stock (R04)'
  puts '8) Add manual items to shopping list (R04)'
  puts '9) Save inventory & notifications'
  puts '0) Exit'
  print 'Choose: '
end

shopping_list = nil
sls = ShoppingListService.new

loop do
  menu
  case (STDIN.gets&.chomp)
  when '1'
    if inv.items.empty?
      puts '[Empty]'
    else
      inv.items.each do |i|
        flag = i.low_stock? ? ' [LOW]' : ''
        puts " - #{i.item_id} #{i.name} | qty=#{i.quantity} thr=#{i.stock_threshold}#{flag}"
      end
    end

  when '2'
    id  = prompt('id: ')
    nm  = prompt('name: ')
    qt  = Integer(prompt('quantity: '))
    th  = Integer(prompt('threshold: '))
    inv.add_item(Item.new(item_id: id, name: nm, quantity: qt, stock_threshold: th))
    puts "Upserted #{id} (#{nm})"

  when '3'
    id = prompt('id: ')
    delta = Integer(prompt('delta (+/-): '))
    item = inv.change_item_amount(id, delta, notifier: notifier)
    if item
      puts(item.low_stock? ? "Low stock now: #{item.name} (#{item.quantity}/#{item.stock_threshold})" : 'OK')
    else
      puts 'Not found'
    end

  when '4'
    id = prompt('id: ')
    puts(inv.remove_item(id) ? 'Removed' : 'Not found')

  when '5'
    id = prompt('id: ')
    thr = Integer(prompt('new threshold: '))
    item = inv.set_item_threshold(id, thr, notifier: notifier)
    puts(item ? "New threshold set (#{item.name}=#{item.stock_threshold})" : 'Not found')

  when '6'
    notes = inv.scan_for_low_stock(notifier: notifier)
    if notes.empty?
      puts 'No low-stock items.'
    else
      notes.each { |n| puts n.message }
    end

  when '7'
    shopping_list = sls.generate_from_inventory(inv)
    n = shopping_list.save
    puts "Shopping list created with #{n} auto line(s) at data/shopping_list.json"

  when '8'
    shopping_list ||= ShoppingList.new
    name = prompt('item name: ')
    qty  = Integer(prompt('qty: '))
    note = prompt('note (optional): ')
    sls.merge_manual(shopping_list, [{ name: name, qty: qty, note: note.empty? ? nil : note }])
    shopping_list.save
    puts 'Added to shopping list.'

  when '9'
    puts "Saved inventory (#{inv.save}) item(s)."
    puts "Saved #{notifier.save_log} notifications."

  when '0'
    puts 'Goodbye!'
    break

  else
    puts 'Invalid'
  end
end
