require 'test_helper'

class Event::Operation::ShowTest < ActiveSupport::TestCase

  test 'should show event' do
    Event::Operation::Create.(title: 'title123', start: Time.current + 1.hour, end: Time.current + 2.hour)
    event = Event.last
    result = Event::Operation::Show.(id: event.uuid)
    assert result.success?
    assert_equal event, result['model']
  end

end
