require 'representable/json'

class Event::Representer::EventRepresenter < Representable::Decorator

  include Representable::JSON

  property :id
  property :title
  property :start
  property :end
  property :uuid
  # collection :composer_ids

end
