class Event::Operation::Show < Trailblazer::Operation

  extend Representer::DSL

  step :model!

  def model!(options, params:)
    options['model'] =
      Event.find_by_uri(params[:uri]) || ActiveRecord::RecordNotFound
  end

end
