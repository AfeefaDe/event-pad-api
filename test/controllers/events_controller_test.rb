require 'test_helper'

class EventsControllerTest < ActionController::TestCase

  test 'should get show' do
    Event::Operation::Create.(
      title: 'title123',
      start: Time.current + 1.hour,
      end: Time.current + 2.hour,
      location: 'hier',
      description: 'passiert nix heute'
    )
    assert event = Event.last
    get :show, params: { uri: event.uri }
    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal event.uri, json['uri']
    assert_equal event.location, json['location']
    assert_equal event.description, json['description']
  end

  test 'should create event' do
    post :create, params: {
      title: 'title123',
      start: Time.current + 1.hour,
      end: Time.current + 2.hour,
      location: 'hier',
      description: 'passiert nix heute'
    }
    assert_response :created
    json = JSON.parse(response.body)
    assert_equal Event.last.uri, json['uri']
    assert_equal Event.last.title, json['title']
  end

  test 'should update event' do
    Event::Operation::Create.(
      title: 'title123',
      start: Time.current + 1.hour,
      end: Time.current + 2.hour,
      location: 'hier',
      description: 'passiert nix heute'
    )
    assert event = Event.last
    patch :update, params: { uri: event.uri, title: 'foo' }
    assert_response :ok
    json = JSON.parse(response.body)
    event.reload
    assert_equal 'foo', json['title']
  end

end
