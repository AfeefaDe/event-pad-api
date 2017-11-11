require 'representable/json'

class Member::Representer::MemberRepresenter < Representable::Decorator

  include Representable::JSON

  property :id
  property :name

end
