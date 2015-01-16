class ChangeCollectives < ActiveRecord::Migration
  def change
    add_reference :collectives, :user, index: true
    remove_column :collectives, :content_json, :json
  end
end
