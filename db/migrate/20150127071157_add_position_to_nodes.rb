class AddPositionToNodes < ActiveRecord::Migration
  def change
    add_column :nodes, :position, :float
  end
end
