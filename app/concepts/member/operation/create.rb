class Member::Operation::Create < Trailblazer::Operation

  extend Representer::DSL

  step :model!
  step Contract::Build(constant: Member::Contract::Base)
  step Contract::Validate()
  # failure :log_error!
  step Contract::Persist()

  def model!(options, params:)
    options['model'] = Member.new
  end

end
