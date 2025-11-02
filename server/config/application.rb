require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Server
  class Application < Rails::Application
    config.load_defaults 7.1
    config.autoload_lib(ignore: %w(assets tasks))
    config.api_only = true

    # Add this for job scheduling
    config.active_job.queue_adapter = :async
    
    # Schedule the expiry reminder job to run daily
    config.after_initialize do
      unless Rails.env.test?
        Thread.new do
          loop do
            ExpiryReminderJob.perform_later
            sleep 24.hours
          end
        end
      end
    end
  end
end
