class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.text :content

      t.references :member

      t.timestamps
    end
  end
end
