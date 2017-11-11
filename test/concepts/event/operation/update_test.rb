require 'test_helper'

class Event::Operation::UpdateTest < ActiveSupport::TestCase

  test 'should update event' do
    Event::Operation::Create.(title: 'title123', start: Time.current + 1.hour, end: Time.current + 2.hour)
    event = Event.last
    assert_no_difference -> { Event.count } do
      result =
        Event::Operation::Update.(id: event.id,
          title: 'foo', start: Time.current + 1.hour, end: Time.current + 2.hour)
      assert result.success?
      event.reload
      assert_equal event, result['model']
      assert_equal 'foo', event.title
    end
  end

end
