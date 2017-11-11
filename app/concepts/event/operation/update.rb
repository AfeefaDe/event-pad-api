class Event::Operation::Update < Event::Operation::Show

  extend Representer::DSL

  step Contract::Build(constant: Event::Contract::Base)
  step Contract::Validate()
  # failure :log_error!
  step Contract::Persist()

end
