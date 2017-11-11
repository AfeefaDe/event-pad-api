class Participant::Contract::Base < Reform::Form

  model :participant

  property :name
  property :event_id
  property :rsvp

end
