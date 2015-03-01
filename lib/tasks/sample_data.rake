namespace :db do
  desc "Fill user database with sample data"
  task populate: :environment do
    make_users
    make_collectives
  end
end

def make_users
  100.times do |n|
    name = Faker::Name.name
    email = "example-#{n+1}@douban.sexy"
    password = "password"
    User.create!(name: name,
                 email: email,
                 password: password,
                 password_confirmation: password)
  end
end

def make_collectives
  users = User.all.limit(6)
  50.times do |n|
    collective_title = Faker::Lorem.sentence(3)
    collective_summary = Faker::Lorem.sentence(6)
    users.each do |user|
      collective = user.collectives.create!(title: collective_title, summary: collective_summary)
      3.times do |m|
        node_title = Faker::Lorem.sentence(3)
        node_summary = Faker::Lorem.sentence(6)
        node = collective.nodes.create!(title: node_title, summary: node_summary, collective_id: collective.id)
        10.times do |o|
          link_title = Faker::Lorem.sentence(3)
          link_summary = Faker::Lorem.sentence(6)
          link_url = Faker::Internet.url
          node.links.create!(title: link_title, url: link_url, summary: link_summary, collective_id: collective.id, node_id: node.id)
        end
      end
    end
  end
end
