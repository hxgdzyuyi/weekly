json.title @title
json.url @url
json.thumbs @grapped_link_covers do |grapped_link_cover|
  json.url grapped_link_cover.thumb.url
  json.identifier grapped_link_cover.thumb.identifier
end
