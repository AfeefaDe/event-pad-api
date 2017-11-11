class Event::Operation::Show < Trailblazer::Operation

  extend Representer::DSL

  step :model!

  def model!(options, params:)
    options['model'] = Event.find(params[:id])
  end

end
