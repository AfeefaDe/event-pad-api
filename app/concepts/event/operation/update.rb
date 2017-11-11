class Event::Operation::Update < Trailblazer::Operation

  extend Representer::DSL

  step :model!
  step Contract::Build(constant: Event::Contract::Base)
  step Contract::Validate()
  # failure :log_error!
  step Contract::Persist()

  def model!(options, params:)
    options['model'] = Event.find(params[:id])
  end

end
