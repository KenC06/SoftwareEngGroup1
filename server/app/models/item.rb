class Item < ApplicationRecord
    # Validations
    validates :name, presence: true
    validates :reminder_days_before, numericality: { only_integer: true, greater_than_or_equal_to: 0, allow_nil: true }
    validate :expiry_date_cannot_be_in_past, if: -> { expiry_date.present? }
    
    # Scopes for expiry management
    scope :expiring_soon, -> { 
      where('expiry_date IS NOT NULL AND expiry_date <= ?', Date.current + 7.days)
      .where(reminder_sent_at: nil)
    }
    
    # FIXED SCOPE - use SQL date arithmetic
    scope :needing_reminder, -> {
      where('expiry_date IS NOT NULL')
      .where('reminder_days_before IS NOT NULL')
      .where('expiry_date <= date(?) + reminder_days_before', Date.current)
      .where(reminder_sent_at: nil)
    }
    
    def needs_reminder?
      return false if expiry_date.blank? || reminder_days_before.blank?
      return false if reminder_sent_at.present?
      
      Date.current >= (expiry_date - reminder_days_before.days)
    end
    
    def mark_reminder_sent!
      update(reminder_sent_at: Time.current)
    end
    
    private
    
    def expiry_date_cannot_be_in_past
      if expiry_date < Date.current
        errors.add(:expiry_date, "cannot be in the past")
      end
    end
  end