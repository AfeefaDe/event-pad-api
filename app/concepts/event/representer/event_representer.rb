require 'representable/json'

class Event::Representer::EventRepresenter < Representable::Decorator

  include Representable::JSON

  property :uri
  property :title
  property :start
  property :end
  property :location
  property :description

end
