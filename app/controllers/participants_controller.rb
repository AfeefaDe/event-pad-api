class ParticipantsController < ApplicationController

  def create
    result = Participant::Operation::Create.(params)

    if result.success?
      render json: Participant::Representer::ParticipantRepresenter.new(result['model']).to_json, status: :created
    else
      render json: 'internal error'
    end
  end

end
