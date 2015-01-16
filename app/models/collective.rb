class Collective < ActiveRecord::Base
  has_many :nodes
  has_many :links
  belongs_to :user
end
