# Category is a directory in the inspiration folder
# Tag is a directory in the category folder
# Image is a file in the tag folder
class Category < ActiveRecord::Base
  has_many :tags, dependent: :destroy

  validates :name, presence: true

  scope :active, -> { where(active: true) }
  scope :hidden, -> { where(active: false) }
  scope :featured, -> { where(featured: true) }

  BASE_PATH = "./inspiration"

  def tags_from_directory
    path = "#{BASE_PATH}/#{name}"
    Dir.entries(path)
      .select { |f| File.directory? File.join(path, f) }
      .reject { |f| f == "." || f == ".." }
      .sort
      .map { |tag| Tag.find_or_initialize_by(name: tag, category_id: id) }
  end

  def self.from_directory
    Dir.entries("./inspiration")
      .select { |f| File.directory? File.join(BASE_PATH, f) }
      .reject { |f| f == "." || f == ".." }
      .sort
      .map { |category| Category.find_or_initialize_by(name: category) }
  end

  def self.find(name)
    all.find { |category| category.name == name.to_s }
  end
end
