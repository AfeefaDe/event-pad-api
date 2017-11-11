class Participant::Operation::Create < Trailblazer::Operation

  extend Representer::DSL

  step :model!
  step Contract::Build(constant: Participant::Contract::Base)
  step Contract::Validate()
  # failure :log_error!
  step Contract::Persist()

  def model!(options, params:)
    options['model'] = Participant.new
    options['model'].event = Event.find_by_uri(params[:uri]) || ActiveRecord::RecordNotFound
  end

end
