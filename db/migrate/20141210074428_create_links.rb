class CreateLinks < ActiveRecord::Migration
  def change
    create_table :links do |t|
      t.string :title
      t.string :url
      t.text :summary
      t.belongs_to :collective, index: true

      t.timestamps
    end
  end
end
