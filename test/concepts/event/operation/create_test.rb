require 'test_helper'

class Event::Operation::CreateTest < ActiveSupport::TestCase

  test 'should create event' do
    assert_difference -> { Event.count } do
      result = Event::Operation::Create.(title: 'title123', start: Time.current + 1.hour, end: Time.current + 2.hour)
      assert result.success?
      assert_equal Event.last, result['model']
      assert Event.last.uuid
    end
  end

end
