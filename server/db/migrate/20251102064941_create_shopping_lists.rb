class CreateShoppingLists < ActiveRecord::Migration[7.1]
  def change
    create_table :shopping_lists do |t|
      t.string :name
      t.integer :quantity
      t.integer :item_id

      t.timestamps
    end
  end
end
