namespace :db do
  desc "Fill user database with sample data"
  task populate: :environment do
    admin = User.create!(name: "Example user",
                        email: "example@douban.sexy",
                        password: "foobar",
                        password_confirmation: "foobar")
  end
end
