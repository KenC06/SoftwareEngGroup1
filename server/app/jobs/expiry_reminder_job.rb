class ExpiryReminderJob < ApplicationJob
    queue_as :default
    
    def perform
      items_needing_reminder = Item.needing_reminder
      
      items_needing_reminder.find_each do |item|
        send_reminder_for_item(item)
        item.mark_reminder_sent!
      end
    end
    
    private
    
    def send_reminder_for_item(item)
      # Log the reminder
      Rails.logger.info "EXPIRY REMINDER: Item '#{item.name}' is expiring on #{item.expiry_date}. " +
                        "Reminder set for #{item.reminder_days_before} days before."
    end
  end