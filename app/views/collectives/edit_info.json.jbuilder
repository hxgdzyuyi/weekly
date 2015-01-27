json.nodes @collective.nodes do |node|
  json.extract! node, :id, :title, :summary, :position
end

json.links @collective.links do |link|
  json.extract! link, :id, :url, :title, :collective_id, :position, :summary, :node_id
end
