class CreateEvents < ActiveRecord::Migration[5.1]

  def change
    create_table :events do |t|
      t.string :title, null: false
      t.datetime :start, null: false
      t.datetime :end, null: true
      t.string :host, null: true
      t.string :location, null: false
      t.text :description, null: true
      t.string :initiator_name, null: true
      t.string :uri, null: false, uniq: true

      t.timestamps
    end
  end

end
