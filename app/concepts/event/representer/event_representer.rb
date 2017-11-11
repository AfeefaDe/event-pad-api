require 'representable/json'

class Event::Representer::EventRepresenter < Representable::Decorator

  include Representable::JSON

  property :uuid, as: :id
  property :title
  property :start
  property :end
  # collection :composer_ids

end
