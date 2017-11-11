require 'test_helper'

class Event::Operation::UpdateTest < ActiveSupport::TestCase

  test 'should update event' do
    Event::Operation::Create.(title: 'title123', start: Time.current + 1.hour, location: 'irgendwo')
    event = Event.last
    assert_no_difference -> { Event.count } do
      result =
        Event::Operation::Update.(uri: event.uri, title: 'foo')
      assert result.success?
      event.reload
      assert_equal event, result['model']
      assert_equal 'foo', event.title
    end
  end

end
