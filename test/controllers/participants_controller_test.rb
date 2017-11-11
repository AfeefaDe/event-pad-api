require 'test_helper'

class ParticipantsControllerTest < ActionController::TestCase

  test 'should create participant for event' do
    Event::Operation::Create.(title: 'title123', start: Time.current + 1.hour, location: 'gruene ecke')
    event = Event.last
    post :create, params: { uri: event.uri, name: 'mr anonymous', rsvp: :accepted }
    assert_response :created
    json = JSON.parse(response.body)
    assert_equal Participant.last.id, json['id']
    assert_equal Participant.last.name, json['name']
    assert_equal event.id, Participant.last.event_id
    assert_equal event.uri, Participant.last.event.uri
  end

end
