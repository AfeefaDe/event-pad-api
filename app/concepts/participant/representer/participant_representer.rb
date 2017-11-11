require 'representable/json'

class Participant::Representer::ParticipantRepresenter < Representable::Decorator

  include Representable::JSON

  property :id
  property :name

end
