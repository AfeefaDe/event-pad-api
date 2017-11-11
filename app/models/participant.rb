class Participant < ApplicationRecord

  enum rsvp: [:accepted, :rejected]

  belongs_to :event

end
