require 'test_helper'

class MembersControllerTest < ActionController::TestCase

  test 'should create member for event' do
    Event::Operation::Create.(title: 'title123', start: Time.current + 1.hour, end: Time.current + 2.hour)
    event = Event.last
    post :create, params: { id: event.id, name: 'mr anonymous' }
    assert_response :created
    json = JSON.parse(response.body)
    assert_equal Member.last.id, json['id']
    assert_equal Member.last.name, json['name']
    assert_equal event.id, Member.last.event_id
  end

end
