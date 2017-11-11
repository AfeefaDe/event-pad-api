class Event::Operation::Create < Trailblazer::Operation

  extend Representer::DSL

  step :model!
  step Contract::Build(constant: Event::Contract::Base)
  step Contract::Validate()
  # failure :log_error!
  step :generate_uuid!
  step Contract::Persist()

  def model!(options, params:)
    options['model'] = Event.new
  end

  def generate_uuid!(options)
    # TODO: Generate UUID
    options['model'].uuid = SecureRandom.uuid
  end

end
