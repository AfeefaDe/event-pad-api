class Event::Contract::Base < Reform::Form

  model :event

  property :title
  property :start
  property :end

end