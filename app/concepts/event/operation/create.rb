class Event::Operation::Create < Trailblazer::Operation

  extend Representer::DSL

  step :model!
  step Contract::Build(constant: Event::Contract::Base)
  step Contract::Validate()
  # failure :log_error!
  step :generate_unique_uri!
  step Contract::Persist()

  def model!(options)
    options['model'] = Event.new
  end

  def generate_unique_uri!(options, params:, **)
    # TODO: Generate UUID
    options['model'].uri = SecureRandom.uuid[0..8] + params[:title].downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  end

end
