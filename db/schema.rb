# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150127071157) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "collectives", force: true do |t|
    t.string   "title"
    t.string   "summary"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
  end

  add_index "collectives", ["user_id"], name: "index_collectives_on_user_id", using: :btree

  create_table "links", force: true do |t|
    t.string   "title"
    t.text     "url"
    t.text     "summary"
    t.integer  "collective_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "position"
    t.string   "link_cover"
    t.integer  "node_id"
  end

  add_index "links", ["collective_id"], name: "index_links_on_collective_id", using: :btree
  add_index "links", ["node_id"], name: "index_links_on_node_id", using: :btree

  create_table "nodes", force: true do |t|
    t.string   "title"
    t.text     "summary"
    t.integer  "collective_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "position"
  end

  add_index "nodes", ["collective_id"], name: "index_nodes_on_collective_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
