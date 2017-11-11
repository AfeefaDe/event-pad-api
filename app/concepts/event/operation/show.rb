class Event::Operation::Show < Trailblazer::Operation

  extend Representer::DSL

  step :model!

  def model!(options, params:)
    options['model'] =
      Event.find_by_uuid(params[:id]) || ActiveRecord::RecordNotFound
  end

end
