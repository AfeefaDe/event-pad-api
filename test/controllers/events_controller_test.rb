require 'test_helper'

class EventsControllerTest < ActionController::TestCase

  test 'should get show' do
    Event::Operation::Create.(title: 'title123', start: Time.current + 1.hour, end: Time.current + 2.hour)
    assert event = Event.last
    get :show, params: { id: event.uuid }
    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal event.uuid, json['id']
    assert_equal event.title, json['title']
  end

  test 'should create event' do
    post :create, params: { title: 'title123', start: Time.current + 1.hour, end: Time.current + 2.hour }
    assert_response :created
    json = JSON.parse(response.body)
    assert_equal Event.last.uuid, json['id']
    assert_equal Event.last.title, json['title']
  end

  test 'should update event' do
    Event::Operation::Create.(title: 'title123', start: Time.current + 1.hour, end: Time.current + 2.hour)
    assert event = Event.last
    patch :update, params: { id: event.uuid, title: 'foo' }
    assert_response :ok
    json = JSON.parse(response.body)
    event.reload
    assert_equal 'foo', json['title']
  end

end
