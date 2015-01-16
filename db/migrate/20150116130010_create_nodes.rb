class CreateNodes < ActiveRecord::Migration
  def change
    create_table :nodes do |t|
      t.string :title
      t.text :summary
      t.references :collective, index: true

      t.timestamps
    end
  end
end
