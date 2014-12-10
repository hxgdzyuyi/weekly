class Collective < ActiveRecord::Base
  has_many :links, -> { order("position ASC") }
end
