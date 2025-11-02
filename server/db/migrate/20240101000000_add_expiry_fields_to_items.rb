class AddExpiryFieldsToItems < ActiveRecord::Migration[7.1]
    def change
      add_column :items, :expiry_date, :date
      add_column :items, :reminder_days_before, :integer
      add_column :items, :reminder_sent_at, :datetime
    end
  end