class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items do |t|
      t.string :name
      t.integer :quantity
      t.integer :low_stock_threshold, default: 0
      t.string :barcode, null: true, default: nil
      t.date :useby, null: true, default: nil
      t.date :useby_notify, null: true, default: nil

      t.timestamps
    end
  end
end
