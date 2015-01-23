class Node < ActiveRecord::Base
  belongs_to :collective
  has_many :links
end
