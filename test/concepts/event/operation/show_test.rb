require 'test_helper'

class Event::Operation::ShowTest < ActiveSupport::TestCase

  test 'should show event' do
    Event::Operation::Create.(title: 'title123', start: Time.current + 1.hour, location: 'dort')
    event = Event.last
    result = Event::Operation::Show.(uri: event.uri)
    assert result.success?
    assert_equal event, result['model']
  end

end
