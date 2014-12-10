class CreateCollectives < ActiveRecord::Migration
  def change
    create_table :collectives do |t|
      t.string :title
      t.string :summary
      t.json :content_json

      t.timestamps
    end
  end
end
