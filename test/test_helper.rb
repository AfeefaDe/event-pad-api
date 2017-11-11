require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

require 'simplecov'
# SimpleCov.start 'rails' do
#   add_group 'Decorators', 'app/decorators'
# end

require 'minitest/rails'
require 'mocha/mini_test'
require 'minitest/reporters'
Minitest::Reporters.use!

# To add Capybara feature tests add `gem "minitest-rails-capybara"`
# to the test group in the Gemfile and uncomment the following:
require 'minitest/rails/capybara'

# Uncomment for awesome colorful output
# require "minitest/pride"

require 'pp'

# # VCR integration and mocks for APIs
# require 'vcr'
#
# VCR.configure do |config|
#   config.allow_http_connections_when_no_cassette = true
#   config.cassette_library_dir = 'test/data/vcr_cassettes'
#   config.hook_into :webmock # or :fakeweb
#
#   config.default_cassette_options = {
#     record: :once,
#     erb: true
#   }
# end

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end
