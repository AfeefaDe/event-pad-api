class CreateParticipants < ActiveRecord::Migration[5.1]

  def change
    create_table :participants do |t|
      t.string :name, null: false
      t.string :email, null: true
      t.integer :rsvp, null: false

      t.references :event, index: true

      t.timestamps
    end

  end
end
